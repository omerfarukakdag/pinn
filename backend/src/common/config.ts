const bookmarksBucketName = process.env.BOOKMARKS_S3_BUCKET;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;

const bookmarksTableName = process.env.BOOKMARKS_TABLE;
const bookmarksTableIndexName = process.env.BOOKMARKS_INDEX_NAME;
const categoriesTableName = process.env.CATEGORIES_TABLE;
const categoriesTableIndexName = process.env.CATEGORIES_INDEX_NAME;

const isOffline = process.env.IS_OFFLINE;
const auth0JWKSUrl = process.env.Auth0JWKSUrl;

export {
  bookmarksBucketName,
  signedUrlExpiration,
  bookmarksTableName,
  bookmarksTableIndexName,
  categoriesTableName,
  categoriesTableIndexName,
  isOffline,
  auth0JWKSUrl,
};
