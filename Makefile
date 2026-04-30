BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

test1:
	echo "test event 1 $(shell date)" > test1.txt
	git add test1.txt
	git commit -m "test: trigger webhook 1"
	git push origin $(BRANCH)

test2:
	echo "test event 2 $(shell date)" > test2.txt
	git add test2.txt
	git commit -m "test: trigger webhook 2"
	git push origin $(BRANCH)

test3:
	echo "test event 3 $(shell date)" > test3.txt
	git add test3.txt
	git commit -m "test: trigger webhook 3"
	git push origin $(BRANCH)