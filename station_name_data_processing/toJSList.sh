src=stadle_20220213.txt
out=names.js

if [ -e $out ]; then
  rm $out
fi

touch $out

echo "export const NAMES = [" >> $out

while read line
do
  echo "  "\'$line\', >> $out
done < $src

echo "]" >> $out

if [ -e names_classed.ts ]; then
  rm names_classed.ts
fi

node makeNamesObj.js
cp names_classed.json ../src/constants/names_classed.json
