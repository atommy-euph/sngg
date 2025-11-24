#!/usr/bin/perl

# 全ての駅をシャッフルする perl スクリプト
#
# 使い方
#
# ./shuffleall.pl < input > output

use List::Util;

$n = 0;

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
	$n++;
    }
}

@shuffle = List::Util::shuffle @list;

print $header;
print @shuffle;
print "};\n";
