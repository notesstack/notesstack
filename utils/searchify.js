function search (content)	{
	var pl = content.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	var fs = pl.replace(/\s{2,}/g," ");

	var lc = fs.toLowerCase();
	var res = lc.split(" ");
	return res;
}

module.exports = search;
