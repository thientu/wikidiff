default:
	docker build -t gianarb/wikidiff-handler .
single:
	docker run -it -v ${PWD}:${PWD} --cpus 1 --memory 500MB -v ${HOME}/.aws/credentials:/root/.aws/credentials --network browserworker_default --name tmp-handler -w ${PWD} --rm node:onbuild npm start 
deploy:
	docker push gianarb/wikidiff-handler
