<?php

namespace frontend\serviceProviders;

use common\models\Photo;
use common\models\PhotoComment;

/**
 * 
 */
class PhotoCommentProvider
{

    public static function list($shortid, $start=0)
    {
        $photo = Photo::findOne(['short_id' => $shortid]);
        if (!$photo) {
            throw new \yii\base\UserException('shortid invalid.');
        }
        $query = PhotoComment::find()->alias('c');
        $query->innerJoin('user as u', 'c.user_id=u.id');
        $query->select('c.id as comment_id, c.content, c.created_at, u.username, u.avatar');
        $query->where(['c.photo_id' => $photo->id]);
        return $query;
    }
}
