<?php
namespace frontend\controllers;

use Yii;

class UploadsController extends BaseJwtController
{

    const ALLOWED_TYPES = [
        'image/gif',
        'image/jpeg',
        'image/png',
        // 'image/svg+xml',
        // 'image/webp',
    ];

    const MB = 1024 * 1024;

    public function actionPhoto()
    {
        $file = \yii\web\UploadedFile::getInstanceByName('file');
        if (!$file) {
            throw new \yii\base\UserException('Bad request.');
        }
        if ($file->error) {
            throw new \yii\base\ErrorException(sprintf('Upload error(code:%s).', $file->error));
        }
        $fileSize = (int)round($file->size / self::MB);
        if ($fileSize > Yii::$app->params['maxUploadImageSizeMb']) {
            throw new \yii\base\UserException(sprintf('File size (%sM) too large.', $fileSize));
        }
        $mime = \yii\helpers\FileHelper::getMimeType($file->tempName);
        if (!in_array($mime, self::ALLOWED_TYPES)) {
            throw new \yii\base\UserException('File type not allowed.');
        }
        // do the save operation
        $destPath = '/uploads/' . date('Ym');
        if (!file_exists(Yii::$app->params['uploadPath'] . $destPath)) {
            mkdir(Yii::$app->params['uploadPath'] . $destPath, 0755, true);
        }
        $fname = sprintf('%s.%s', (date('dHis') . random_int(100000, 999999)), $file->extension);
        $dest = sprintf('%s/%s', $destPath, $fname);
        if (!$file->saveAs(Yii::$app->params['uploadPath'] . $dest)) {
            throw new \yii\base\ErrorException(sprintf('Upload error(code:%s).', $file->error));
        }
        // record upload logs
        $this->recordUploadLog($dest, $file->name);
        return [
            'path' => $dest,
            'url' => Yii::$app->params['fileServer'] . $dest,
        ];
    }

    private function recordUploadLog($filePath, $fileName)
    {
        Yii::$app->db->createCommand()->insert('sys_uploads_log', [
            'file_path' => $filePath,
            'file_name' => $fileName,
            'creator' => Yii::$app->user->id,
        ])->execute();
    }
}
