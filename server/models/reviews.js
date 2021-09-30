const db = require('../../reviews_database_service/dbConnection.js')
//? YUGE: to_timestamp(reviews.date / 1000) AS date


module.exports = {
  //? UNFORMATTED TOTAL DATA.
  getReviews: function (product_id) {
    const data = db.pool
   console.log(product_id)
    return data.query(`SELECT DISTINCT
    reviews.id AS reviews_id, reviews.rating, reviews.summary, reviews.recommend, reviews.response, reviews.body, to_timestamp(reviews.date / 1000) AS date, reviews.reviewer_name, reviews.helpfulness, reviews.reported, reviews_characteristics.value AS characteristics_value, reviews_characteristics.characteristic_id AS characteristics_id, characteristics.name AS characteristics_name, products.name AS product_name, reviews_photos.url AS photo_url, reviews_photos.id AS photo_id
    FROM reviews LEFT JOIN reviews_photos
        ON reviews_photos.review_id = reviews.id,
    reviews_characteristics, characteristics, products
    WHERE reviews.product_id = ${product_id}
    AND reviews_characteristics.review_id = reviews.id
    AND characteristics.id = reviews_characteristics.characteristic_id
    AND reviews.product_id = products.id;` )
    .then(responseData => {
      console.log(responseData.rows)
      return responseData.rows;
    })
    .catch(err => {
      console.log('ERROR MODEL', err)
    })
  },

  reportReview: function(review_id) {
    const data = db.pool;
    console.log(review_id)
    return data.query(`UPDATE reviews SET reported = TRUE WHERE id=${review_id};`)
    .then(response => {
      console.log('successful report', response)
    })
    .catch(err => {
      console.log('ERROR reporting', err)
    })
  },

  updateReviewHelpful: function (review_id) {
    const data = db.pool;
    return data.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id=${review_id}`)
    .then(response => {
      console.log(`posted review ${review_id} as helpful`, response)
    })
    .catch(err => {
      console.log(('ERROR adding helpful note', err))
    })
  },
  // ?convert date?  ROUND(EXTRACT(EPOCH FROM NOW())::float*1000)
  // postReview: function (review) {
  //   const data = db.pool;
  //   const reviewsQString = ` INSERT INTO reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES(DEFAULT, ${data.product_id}, ${data.rating}, ROUND(EXTRACT(EPOCH FROM NOW())::float*1000), '${data.summary}', '${data.body}', ${data.recommend}, FALSE, '${data.name}', '${data.email}', '', 0)`
  //   return data.query()
  // }


}
