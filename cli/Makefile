SYSNAME:=$(shell uname -s)
ifeq ($(findstring MINGW, $(SYSNAME)),MINGW)
  ARCH_LIB=resource.o
endif

tetsudoru: tetsudoru.c data.h $(ARCH_LIB)
	gcc -O2 tetsudoru.c $(ARCH_LIB) -o tetsudoru

resource.o: resource.h resources.rc ../public/favicon.ico
	windres -i resources.rc -o resource.o

clean:
	rm -f tetsudoru.exe $(ARCH_LIB)
