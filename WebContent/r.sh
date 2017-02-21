#! /bin/bash

Rscript -e 'jpeg("'$1'");plot(seq(-pi,pi,pi/40),'$2'*sin(seq(-pi,pi,pi/40)),main="y='$3'",xlab="X",ylab="Y",type="l");dev.off();'
