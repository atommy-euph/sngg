src=station_names.txt
out=names.js
json_filename=station_names.json

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

if [ -e $json_filename ]; then
  rm $json_filename
fi

node makeNamesObj.js
cp $json_filename ../src/constants/$json_filename
