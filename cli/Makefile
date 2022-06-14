tetsudoru.exe: tetsudoru.c data.h resource.o
	gcc -O2 tetsudoru.c resource.o -o tetsudoru.exe

resource.o: resource.h resources.rc ../public/favicon.ico
	windres -i resources.rc -o resource.o

clean:
	rm -f tetsudoru.exe resource.o
