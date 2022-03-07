mkdir -p dist
if [ $# -eq 0 ]; then
  webpack --mode=development
else
  webpack --mode=$1
fi

mkdir -p dist/sprites
cp src/sprites/spritesheet.json dist/sprites/>pritesheet.json 
cp src/sprites/spritesheet.png dist/sprites/spritesheet.png 

cp index.html dist/index.html