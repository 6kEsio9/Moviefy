# !/bin/bash

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <csv_file> <start_field>, <fields_after> "
  echo $#
  exit 1
fi

csv_file="$1"
start_field="$2"
fields_after="$3"

tail -n +2 "$csv_file" | awk -F',' -v start="$start_field" -v after="$fields_after" '{
  whole_field = $1;
  for(i = 2; i <= start; i++){
    gsub(/\t/, "", $i);
    whole_field = whole_field "\t" $i;
  }
  for (i = (start + 1); i <= (NF - after); i++) {
    gsub(/\t/, "", $i);
    whole_field = whole_field "," $i;
  }
  for(i = (NF - after + 1); i <= NF; i++){
    gsub(/\t/, "", $i);
    whole_field = whole_field "\t" $i;
  }
    print whole_field;
}'

echo "finished"
