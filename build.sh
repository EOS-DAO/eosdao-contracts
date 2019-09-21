#!/usr/bin/env bash
set -eo pipefail

printf "\t=========== Building eosdao.contracts ===========\n\n"
RED='\033[0;31m'
NC='\033[0m'

CPU_CORES=$(getconf _NPROCESSORS_ONLN)
mkdir -p build
pushd build &> /dev/null
cmake ../
make -j $CPU_CORES
popd &> /dev/null
