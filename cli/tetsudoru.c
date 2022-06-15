#include <stdio.h>
#include <wchar.h>
#include <time.h>
#include <windows.h>
#include "data.h"

int isNumber(char *str)
{
  int len, i, result = 1;
  len = strlen(str);
  for(i = 0; i < len && result ; i++)
    result = isdigit(str[i]);
  return result;
}

int group(wchar_t w)
{
  int i, j;
  for (i=0; i<28; i++)
    for (j=0; j<3; j++)
      if (w == *groups[i][j])
	return i;
  return -1;
}

int IsSameGroup(wchar_t *ans, wchar_t *inp)
{
  int a, b;
  a = group(ans[0]);  b = group(inp[0]);
  if (a == b)
    if (a != -1)
      return 1;
  return 0;
}

void compare(wchar_t *target, wchar_t *input, int *a)
{
  int i, j, b[5];
  for (i = 0; i < 5; i++)
    a[i] = b[i] = 0;
  /* 緑チェック */
  for (i=0; i<5; i++)
    if(target[i] == input[i])
      a[i] = b[i] = 1;
  /* 黄チェック */
  for (i=0; i<5; i++)
    if(a[i] == 0)
      for (j=0; j<5; j++)
	if(b[j] == 0)
	  if(input[i] == target[j])
	    a[i] = b[j] = 2;
  /* 紫チェック */
  for (i=0; i<5; i++)
    if(a[i] == 0)
      for (j=0; j<5; j++)
	if(b[j] == 0)
	  if (IsSameGroup(&input[i], &target[j]))
	    a[i] = b[j] = 3;
}

int mywprintf(const wchar_t *fmt, ...)
{
  int n;
  wchar_t wstr[256];
  char str[1024];
  va_list ap;

  va_start(ap, fmt);
  vswprintf(wstr, 255, fmt, ap);
  va_end(ap);
  n = WideCharToMultiByte(CP_ACP, 0, wstr, -1, str, 255, NULL, NULL);
  str[n] = '\0';
  return printf(str);
}

void mywputc(wchar_t wch)
{
  char str[5];
  int n;
  n = WideCharToMultiByte(CP_ACP, 0, &wch, 1, str, 3, NULL, NULL);
  str[n] = '\0';
  printf("%s", str);
}

int isStation(wchar_t *str)
{
  int i;
  for (i = 0; i < N; i++)
    if (wcscmp(str, station[i]) == 0)
      return 1;
  return 0;
}

int count_rest(wchar_t *problem, int nans)
{
  int i, j, k, n, a[5], b[5];
  int isSamePattern;
  
  n = 0;
  for(i = 0; i < N; i++){
    isSamePattern = 1;
    for(j = 0; j < nans + 1; j++){
      compare(station[i], ans[j], a);
      compare(problem, ans[j], b);
      for (k = 0; k < 5; k++)
	if (a[k] != b[k]) isSamePattern = 0;
    }
    if (isSamePattern == 1) n++;
  }
  return n;
}

int start_game(int day)
{
  int nans, i, a[5], rest;
  char input[16];
  wchar_t problem[6];

  wcscpy(problem, station[day]);
  printf("\n");
  nans=0;
  while(1){
    printf(" %d : \e[K", nans + 1);
    gets(input);
    if(strlen(input) == 0) {
      printf("\e[F");
      continue;
    }
    MultiByteToWideChar(CP_ACP, 0, input, -1, ans[nans], 6);
    if (!isStation(ans[nans])){
      mywprintf(L"\e[F %d : リストにありません\e[K\n", nans + 1);
      Sleep(1000);
      printf("\e[F");
      continue;
    }else{
      compare(problem, ans[nans], a);
      printf("\e[F %d : ", nans + 1);
      for (i = 0; i < 5; i++){
	printf(color[a[i]]);
	mywputc(ans[nans][i]);
	printf(color[0]);
      }
      if (wcscmp(problem, ans[nans]) == 0){
	mywprintf(L"\n\n目的地に到着！\n");
	return 0;
      }
      if (nans < 5){
	rest=count_rest(problem, nans);
	mywprintf(L" - 残り候補数: %3d", rest);
      }
      printf("\n");
      nans++;
      if (nans == 6) {
	mywprintf(L"\n残念！途中下車…\n");
	mywprintf(L"\n正解は「%ls」でした。\n", problem);
	return 0;
      }
    }
  }
}

int main(void)
{
  time_t t0, t;
  int day, day_max;
  char str[255];

  HANDLE stdOut = GetStdHandle(STD_OUTPUT_HANDLE);
  DWORD consoleMode = 0;
  GetConsoleMode(stdOut, &consoleMode);
  consoleMode = consoleMode | ENABLE_VIRTUAL_TERMINAL_PROCESSING;
  SetConsoleMode(stdOut, consoleMode);

  t0 = 1645023600;
  t = time(NULL);
  
  day_max = (t-t0)/86400+1;
  while(1){
    mywprintf(L"\nゲーム番号を入力 [1-%d] (0で終了) : \e[K", day_max);
    gets(str);
    if(strlen(str) == 0 || !isNumber(str)) {
      printf("\e[2F");
      continue;
    }
    day = atoi(str);
    if (day == 0) return 0;
    if (day > day_max){
      mywprintf(L"\n未来の問題はできません！");
      Sleep(1000);
      printf("\e[G\e[K\e[3F");
    }else{
      start_game(day);
    }
  }
}
