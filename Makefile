.PHONY: dev clean

dev: node_modules
	npm run dev

node_modules:
	npm install

clean:
	rm -rf node_modules
