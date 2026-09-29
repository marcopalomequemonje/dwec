if (0) console.log("A"); //NO
if ("0") console.log("B"); //SI
if ([]) console.log("C"); //SI
if (null) console.log("D"); //NO
if (" ") console.log("E"); //SI
if (NaN) console.log("F"); //NO
if (-1) console.log("G"); //SI
if (undefined) console.log("H"); //NO