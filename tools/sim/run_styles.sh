#!/bin/bash
# AI 스타일(이자형·안정형·밸런스형·특수) 승률 실험: 4개 병렬 × 판수
# 사용: tools/sim/run_styles.sh 태그 판수 '패치 JS'  (예: ... kr25 40 "BAL.kr=.25")
D=$(cd "$(dirname "$0")" && pwd); OUT=${OUT:-/tmp/jjak_sim}; mkdir -p $OUT
for i in 1 2 3 4; do node $D/aisim.js $2 $OUT/$1_$i.json N "$3" > $OUT/$1_$i.log 2>&1 & done; wait
python3 $D/aian.py $OUT $1
