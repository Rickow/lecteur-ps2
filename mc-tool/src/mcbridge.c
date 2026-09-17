/*
 * mcbridge — thin high-level wrapper over ps2vmc-tool's mcio engine, exposing a
 * flat API that is easy to drive from JavaScript (no struct marshaling).
 * mcio (bucanero/ps2vmc-tool) is GPLv3; this wrapper is GPLv3 as well.
 *
 * A PS2 memory card image (.ps2 / .vmc) is 8,650,752 bytes (16384 pages of 528,
 * i.e. 512 data + 16 ECC spare). mcio operates in place on the buffer we mount.
 */
#include "mcio.h"
#include <string.h>
#include <stdlib.h>

#define VMC_SIZE 8650752

/* Format a fresh, blank (0xFF) buffer into a usable, empty PS2 card. */
int mcb_format(unsigned char *buf, int size)
{
	memset(buf, 0xFF, size);
	mcio_init(buf, size);            /* returns NoFormat on a blank buffer — expected */
	return mcio_mcFormatBlank();     /* lays down superblock + FAT + root dir */
}

/* Mount an existing image buffer (for import / listing). */
int mcb_mount(unsigned char *buf, int size)
{
	return mcio_init(buf, size);
}

int mcb_flush(void)              { return mcio_mcFlush(); }
int mcb_mkdir(const char *path)  { return mcio_mcMkDir(path); }

int mcb_getfree(void)
{
	int free_bytes = 0;
	mcio_mcGetAvailableSpace(&free_bytes);
	return free_bytes;
}

/* Write a file (create/overwrite). Returns bytes written, or a negative mcio error. */
int mcb_write(const char *path, const unsigned char *data, int len)
{
	int fd = mcio_mcOpen(path, sceMcFileCreateFile | sceMcFileAttrWriteable | sceMcFileAttrFile);
	if (fd < 0) return fd;
	int put = len > 0 ? mcio_mcWrite(fd, (void *)data, len) : 0;
	mcio_mcClose(fd);
	return put;
}

/* File size in bytes, or -1 if it does not exist / is not a file. */
int mcb_size(const char *path)
{
	struct io_dirent d;
	memset(&d, 0, sizeof(d));
	if (mcio_mcStat(path, &d) != sceMcResSucceed) return -1;
	return (int)d.stat.size;
}

/* Read a whole file into out (up to max). Returns bytes read, or negative error. */
int mcb_read(const char *path, unsigned char *out, int max)
{
	int fd = mcio_mcOpen(path, sceMcFileAttrReadable | sceMcFileAttrFile);
	if (fd < 0) return fd;
	int got = mcio_mcRead(fd, out, max);
	mcio_mcClose(fd);
	return got;
}

/*
 * List a directory into `out` as lines "name\tsize\tisdir\n" (skipping . and ..),
 * NUL-terminated. The directory is fully read and closed before returning, so the
 * caller can then open files without exhausting mcio's few descriptors.
 * Returns the entry count, or a negative mcio error.
 */
int mcb_list(const char *dir, char *out, int outmax)
{
	int dd = mcio_mcDopen(dir);
	if (dd < 0) return dd;

	struct io_dirent d;
	int count = 0, off = 0;
	while (mcio_mcDread(dd, &d) > 0) {
		if (!strcmp(d.name, ".") || !strcmp(d.name, "..")) continue;
		int isdir = (d.stat.mode & sceMcFileAttrSubdir) ? 1 : 0;
		char line[320];
		int n = snprintf(line, sizeof(line), "%s\t%u\t%d\n", d.name, d.stat.size, isdir);
		if (n < 0 || off + n >= outmax) break;
		memcpy(out + off, line, n);
		off += n;
		count++;
	}
	mcio_mcDclose(dd);
	out[off] = 0;
	return count;
}
