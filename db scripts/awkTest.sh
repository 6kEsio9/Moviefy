# !/bin/bash

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <tsv_file> [<column_number1>, ...] "
  exit 1
fi

tsv_file="$1"
shift
columns=("$@")

echo -e | tail -n +2 "$tsv_file" | awk -F'\t' -v cols="${columns[*]}" -v OFS='\t' '
BEGIN{
  split(cols, cols_to_convert, " ");
  for(i in cols_to_convert){
    columns[cols_to_convert[i]] = 1; 
  }
}
{
  for(col = 1; col <= NF; col++){
    if(columns[col]){

      if($col == "\\N"){
        $col = "{}"
        continue
      }

      original = $col;

      gsub(/ /, "", original);
      split(original,genres,",");
      $col = "{";
      
      for (i = 1; i <= length(genres);i++){
        if(i > 1) $col = $col ", ";
        $col = $col "\"" genres[i] "\"";
      }

      $col = $col "}";

    }
  }
  print $0;
}'
