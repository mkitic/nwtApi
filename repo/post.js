
const { db } = require('db')
const { mapper, dbMapper } = require('repo/base')

// id, views, downloads, likes, user, imageUrl

const getMapper = mapper({
  id: 'id',
  downloads: 'downloads',
  views: 'views',
  imageUrl: 'imageUrl',
  likes: 'likes',
  user: 'user',
  tags: 'tags',
})

async function like (postImage, userId) {
  const { id } = postImage

  const exists = await db().then(con => con.get(`
    SELECT * FROM imagePost
    WHERE id = ?`, [id]))
  // add to likes
  console.log('exists:', exists)

  if (!exists) {
    console.log('like -> dbMapper(postImage)', dbMapper(postImage))
    await db().then(con => con.run(`
      INSERT INTO imagePost (id, views, downloads, likes, user, imageUrl, tags)
      VALUES (:id, :views, :downloads, :likes, :user, :imageUrl, :tags)`,
    dbMapper(postImage),
    ))
    console.log('HERE I AM')
    await db().then(con => con.run(`
      INSERT INTO likes (user_id, post_id)
      VALUES (:user_id, :post_id)
    `,
    {
      ':user_id': userId,
      ':post_id': id,
    },
    ))
  } else {
    console.log('HERE I AM 22')
    const isLiked = await db().then(con => con.get(`
    SELECT * FROM likes
    WHERE post_id = ?
    AND user_id = ?`, [id, userId]))

    console.log('like -> isLiked', isLiked)
    const sqlQuery = isLiked ? 'DELETE FROM likes WHERE id = @id'
      : 'INSERT INTO likes (post_id, user_id) VALUES (:postId, :userId)'

    console.log('like -> sqlQuery', sqlQuery)
    await db().then(con => con.prepare(sqlQuery)).then(query => query.run(isLiked
      ? { '@id': isLiked.id }
      : { ':postId': id, ':userId': userId }))
  }
}

async function getLikedPostsForUser (userId) {
  return db().then(con => con.all(`
    SELECT  imagePost.id, user_id, views, downloads, likes, user, imageUrl FROM imagePost JOIN likes l on imagePost.id = l.post_id
    WHERE  user_id = ?
  `, [userId]))
  .then(getMapper)
}

module.exports = {
  like,
  getLikedPostsForUser,
}
