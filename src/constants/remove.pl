#!/usr/bin/perl

# リストから指定した駅を削除する perl スクリプト
# 過去に出題された駅を削除したら、src/lib/words.ts のdayOffsetの値を
# インクリメントすること。
#
# 使い方： ./remove.pl < input > output

# 削除する駅
$extinct = "ナカノサワ";

# 削除前のオフセット値
$dayOffset = 3;

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
	if ($list[$n] =~ /$extinct/){
	    $nrem = $n;
	}
	$n++;
    }
}

print $header;
for ($i = 0; $i <= $n; $i++){
    if ($list[$i] =~ /$extinct/){
	next;
    }
    print $list[$i];
}
print "};\n";

$stnum = $nrem + $dayOffset + 1;
print STDERR "Station No. $stnum - $extinct removed\n";
