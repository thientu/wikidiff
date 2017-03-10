default:
	docker run -it -v ${PWD}:${PWD} -w ${PWD} --rm node npm install
	docker build -t gianarb/wikidiff-handler .
single:
	docker run -it -v ${PWD}:${PWD} --cpus 1 --memory 500MB -v ${HOME}/.aws/credentials:/root/.aws/credentials --network micro-net --name tmp-handler -w ${PWD} --rm node node index.js
deploy:
	docker tag gianarb/wikidiff-handler 80.247.66.205:5000/wkidiff/handler
	docker push 80.247.66.205:5000/wkidiff/handler
