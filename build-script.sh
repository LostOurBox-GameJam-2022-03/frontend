mkdir -p dist
webpack
mkdir -p dist/sprites
cp src/sprites/spritesheet.json dist/sprites/spritesheet.json 
cp src/sprites/spritesheet.png dist/sprites/spritesheet.png 
cp src/sprites/PlayerFighter.png dist/sprites/PlayerFighter.png 
cp src/sprites/Gem.png dist/sprites/Gem.png 
cp index.html dist/index.html