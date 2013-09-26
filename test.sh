#########################################################
# This file is a part of nekland editor package			#
#														#
# (c) Nekland <nekland.fr@gmail.fr>						#
#														#
# For the full license, take a look to the LICENSE file #
# on the root directory of this project					#
#########################################################


# Usages
#	test.sh all
#	test.sh functionnal
#	test.sh unit

# Requirements for functionnal tests
#	- phantomjs
#	- casperjs

# Requirements for unit tests
#	- nodejs


# Unit testing
if [ "$1" = "all" ] || [ "$1" = "unit" ]; then
	echo "No unit tests for now.\n\n"
fi

# Functionnal tests
if [ "$1" = "all" ] || [ "$1" = "functionnal" ]; then
	echo "Launching functionnal tests..."
	casperjs test ./tests/casper_test.js $PWD
fi

if [ "$1" = "" ]; then
	echo "Help for testing\n"
	echo "Usages"
	echo "\t- test.sh all"
	echo "\t- test.sh functionnal"
	echo "\t- test.sh unit"

	# wrong usage, so wrong output
	exit 1
fi

exit 0
