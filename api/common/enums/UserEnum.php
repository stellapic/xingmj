<?php
namespace common\enums;

class UserEnum
{

    const STATUS_DELETED = 0;
    const STATUS_INACTIVE = 9;
    const STATUS_ACTIVE = 10;

    public static function statusMap()
    {
        return [
            self::STATUS_DELETED => '已删除',
            self::STATUS_INACTIVE => '未激活',
            self::STATUS_ACTIVE => '正常',
        ];
    }

}
