<?php
namespace frontend\modules\user\controllers;

use common\enums\UserRelPhotoEnum;
use common\models\Photo;
use common\models\UserRelPhoto;
use common\models\PhotoComment;
use Yii;

class PhotoController extends BaseUserController
{

    public function actionLike()
    {
        return $this->addUserRelPhoto(Yii::$app->request->post('shortid'), UserRelPhotoEnum::REL_TYPE_LIKE);
    }

    public function actionUnlike()
    {
        return $this->addUserRelPhoto(Yii::$app->request->post('shortid'), UserRelPhotoEnum::REL_TYPE_LIKE, true);
    }

    public function actionFavorite()
    {
        return $this->addUserRelPhoto(Yii::$app->request->post('shortid'), UserRelPhotoEnum::REL_TYPE_FAVORITE);
    }

    public function actionRemoveFavorite()
    {
        return $this->addUserRelPhoto(Yii::$app->request->post('shortid'), UserRelPhotoEnum::REL_TYPE_FAVORITE, true);
    }

    private function addUserRelPhoto($shortid, $relType, $remove=false)
    {
        $photo = Photo::findOne(['short_id' => $shortid]);
        if (!$photo) {
            throw new \yii\base\UserException('shortid invalid.');
        }

        $relInstance = UserRelPhoto::findOne([
            'user_id' => Yii::$app->user->id,
            'rel_type' => $relType,
            'photo_id' => $photo->id,
            ]);
        if (!$remove) {
            // 添加喜欢或收藏
            if ($relInstance) {
                return;
            }
            $instance = new UserRelPhoto();
            $instance->user_id = Yii::$app->user->id;
            $instance->rel_type = $relType;
            $instance->photo_id = $photo->id;
            if ($instance->save()) {
                // update counters
                if ($relType == UserRelPhotoEnum::REL_TYPE_LIKE) {
                    $photo->updateCounters(['thumbs_count' => 1]);
                } else {
                    $photo->updateCounters(['favorites_count' => 1]);
                }
            }
        } else {
            // 移除喜欢或收藏
            if (!$relInstance) {
                return;
            }
            $relInstance->delete();
            // update counters
            if ($relType == UserRelPhotoEnum::REL_TYPE_LIKE) {
                $photo->updateCounters(['thumbs_count' => -1]);
            } else {
                $photo->updateCounters(['favorites_count' => -1]);
            }
        }
    }

    public function actionComments()
    {
        $shortid = Yii::$app->request->post('shortid');
        $content = Yii::$app->request->post('content');
        if (!$shortid) {
            throw new \yii\base\UserException('parameter shortid required.');
        }
        if (!$content) {
            throw new \yii\base\UserException('parameter content required.');
        }
        $photo = Photo::findOne(['short_id' => $shortid]);
        if (!$photo) {
            throw new \yii\base\UserException('shortid invalid.');
        }
        $comment = new PhotoComment();
        $comment->photo_id = $photo->id;
        $comment->user_id = Yii::$app->user->id;
        $comment->content = $content;
        $comment->save();
        $photo->updateCounters(['comments_count' => 1]);
    }

    public function actionUncomments()
    {
        $commentId = Yii::$app->request->post('comment_id');
        if (!$commentId) {
            throw new \yii\base\UserException('parameter comment_id required.');
        }
        $comment = PhotoComment::findOne(['id' => $commentId]);
        if (!$comment) {
            throw new \yii\base\UserException('delete failed.');
        }
        if ($comment->user_id != Yii::$app->user->id) {
            throw new \yii\base\UserException('not comment author.');
        }
        $comment->delete();
        $photo->updateCounters(['comments_count' => -1]);
    }


}
