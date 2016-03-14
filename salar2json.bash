#!/bin/bash
 
# Open JSON
echo "{" > salar.json
echo "    \"salar\": [" >> salar.json

# Read column names from file
IFS="," read salsnr salsnamn lat long ort hus vaning typ storlek \
       < <(sed -n "2p" < salar.csv)

row=0

# Loop through each row and write correct JSON
while IFS="," read salsnrValue salsnamnValue latValue longValue ortValue husValue vaningValue typValue storlekValue
do
  # Skip first 2 rows with column names
  if [[ ${row} -gt 1 ]]; then
    echo "        {" >> salar.json

    # Empty columns need to be set to null
    if [[ ${salsnrValue} = "" ]]; then
      echo "            \"${salsnr}\": null," >> salar.json
    else
      echo "            \"${salsnr}\": \"${salsnrValue}\"," >> salar.json
    fi

    if [[ ${salsnamnValue} = "" ]]; then
      echo "            \"${salsnamn}\": null," >> salar.json
    else
      echo "            \"${salsnamn}\": \"${salsnamnValue}\"," >> salar.json
    fi

    if [[ ${latValue} = "" ]]; then
      echo "            \"${lat}\": null," >> salar.json
    else
      echo "            \"${lat}\": \"${latValue}\"," >> salar.json
    fi

    if [[ ${longValue} = "" ]]; then
      echo "            \"${long}\": null," >> salar.json
    else
      echo "            \"${long}\": \"${longValue}\"," >> salar.json
    fi

    echo "            \"${ort}\": \"${ortValue}\"," >> salar.json

    if [[ ${husValue} = "" ]]; then
      echo "            \"${hus}\": null," >> salar.json
    else
      echo "            \"${hus}\": \"${husValue}\"," >> salar.json
    fi

    if [[ ${vaningValue} = "" ]]; then
      echo "            \"${vaning}\": null," >> salar.json
    else
      echo "            \"${vaning}\": \"${vaningValue}\"," >> salar.json
    fi

    echo "            \"${typ}\": \"${typValue}\"," >> salar.json

    # Since the storlek column is last on each row in the csv file we need to cut off the newline using %?
    if [[ ${storlekValue%?} = "" ]]; then
      echo "            \"${storlek%?}\": null" >> salar.json
    else
      echo "            \"${storlek%?}\": \"${storlekValue%?}\"" >> salar.json
    fi

    echo "        }," >> salar.json
  fi
  ((row++))
done < salar.csv

# Remove comma from last line by deleting the whole line and then adding } without a comma
# The following line is OS X specific, on GNU sed use 'sed -i '$ d' salar.json' instead
sed -i '' -e '$ d' salar.json
echo "        }" >> salar.json

# Close JSON
echo "    ]" >> salar.json
echo "}" >> salar.json