#!/bin/bash
# 종족전(실제 성향 풀 + 종족 무작위) 실험: tools/sim/run_race.sh 태그 판수 '패치 JS'
D=$(cd "$(dirname "$0")" && pwd); OUT=${OUT:-/tmp/jjak_sim}; mkdir -p $OUT
for i in 1 2 3 4; do node $D/aisim.js $2 $OUT/$1_$i.json N "$3" race > $OUT/$1_$i.log 2>&1 & done; wait
python3 $D/aian.py $OUT $1; python3 $D/race_an.py $OUT $1
