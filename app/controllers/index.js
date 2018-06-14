var mongoose = require('mongoose')
var Movie = mongoose.model('Movie')
// var Category = mongoose.model('Category')

// index page

exports.index = function(req, res) {
  console.log("进入首页！！")
  console.log(req.session.user)
  // if(req.session.user){
  //      app.local.user =  req.session.user;
  // }
   Movie.fetch(function(err,movies){
            if(err){
                console.log(err)
             }
            //  console.log("movies "+movies);
            res.render('index',{
                title:'欢迎进入首页',
                movies:movies
            })
        })


      // res.render('index', {
      //   title: 'imooc 首页11',
      //   movies: 'categories'
      // })
      
}

// search page
exports.search = function(req, res) {
  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'movies',
        select: 'title poster'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        var movies = category.movies || []
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
  else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}