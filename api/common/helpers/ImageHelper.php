<?php

namespace common\helpers;

class ImageHelper
{
    public static function convertToThumbnailPath($sourceFile, $thumbnail=\common\enums\ThumbnailEnum::MEDIUM)
    {
        $suffix = explode('.', $sourceFile);
        $extension = count($suffix) > 1 ? '.' . end($suffix) : '';
        switch ($thumbnail) {
            case \common\enums\ThumbnailEnum::TINY:
                return $sourceFile . '_tiny' . $extension;
            case \common\enums\ThumbnailEnum::SMALL:
                return $sourceFile . '_small' . $extension;
            case \common\enums\ThumbnailEnum::MEDIUM:
                return $sourceFile . '_medium' . $extension;
            case \common\enums\ThumbnailEnum::LARGE:
                return $sourceFile . '_large' . $extension;
            // case \common\enums\ThumbnailEnum::ORIGINAL:
            default:
                return $sourceFile;
        }
        return $sourceFile;
    }
}
