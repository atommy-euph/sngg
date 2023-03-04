#!/usr/bin/perl

# 明日以降の駅名リストをシャッフルする perl スクリプト
# Wikipedia のリストで駅が増えた場合、末尾に追加の後、このスクリプトを通すと良い。
#
# 使い方
#
# ./shuffle.pl < input > output

use List::Util;

$n = 0;

# 今日の回答

$today = "スナダバシ";

while (<>)
{
    if (/^.+: \[$/){
	$list[$n] = $_;
	last;
    }
    $header .= $_;
}

while (<>){
    if (/^\}\;$/){
	$n--;
	last;
    }
    $list[$n] .= $_;
    if (/^.*\],$/){
	if ($list[$n] =~ /$today/){
	    $start = $n + 1;
	}
	$n++;
    }
}

@shuffle = List::Util::shuffle @list[$start..$n];

print $header;
print @list[0..$start-1];
print @shuffle;
print "};\n";
