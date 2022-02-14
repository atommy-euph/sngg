#!/usr/bin/perl

use utf8;
use Encode ();

sub utf8kana {
    my $str = shift;
    my $flag = utf8::is_utf8($str);
    Encode::_utf8_on($str);
    $str =~ tr/あ-ん/ア-ン/;
    if (!$flag) { Encode::_utf8_off($str); }
    return $str;
}

while (<>){
    $_ = utf8kana($_);
    print;
}

