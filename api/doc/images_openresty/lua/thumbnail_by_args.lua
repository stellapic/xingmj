-- nginx thumbnail module 
-- last update : 2014/8/21
-- version     : 0.4.1

local c  = require 'config'

--[[
    uri               :链接地址，如/202106/E27EPsHWYAM6eOr.jpeg?t=medium
    ngx_img_root      :图片根目录
    ngx_thumbnail_root:缩略图根目录
    img_width         :缩略图宽度 
    img_width         :缩略图高度
    img_size          :缩略图宽x高
    img_crop_type     :缩略图裁剪类型
    cur_uri_reg_model :缩略图uri正则规则
]]
local uri = ngx.var.uri
local arg_t = ngx.var.arg_t
local ngx_img_root = ngx.var.image_root
local ngx_thumbnail_root = ngx.var.thumbnail_root
local img_width,img_height,img_size = 0
local img_crop_type = 5
local cur_uri_reg = '_[tiny|small|medium|large|original]+[.jpg|.png|.gif|.jpeg]+'

--[[
    日志函数
    log_level: 默认为ngx.NOTICE
    取值范围：ngx.STDERR , ngx.EMERG , ngx.ALERT , ngx.CRIT , ngx.ERR , ngx.WARN , ngx.NOTICE , ngx.INFO , ngx.DEBUG
    请配合nginx.conf中error_log的日志级别使用
]]
function lua_log(msg,log_level)
    log_level = log_level or c.lua_log_level
    if(c.enabled_log) then 
        ngx.log(log_level,msg) 
    end
end

-- 拼接gm命令
local function generate_gm_command(img_crop_type,img_original_path,img_size,img_thumbnail_path)
    local cmd = c.gm_path .. ' convert ' .. img_original_path
    if (img_crop_type == 1) then
        cmd = cmd .. ' -thumbnail '  .. img_size .. ' -background ' .. c.img_background_color .. ' -gravity center -extent ' .. img_size
    elseif (img_crop_type == 2) then
        cmd = cmd .. ' -thumbnail '  .. img_size    
    elseif (img_crop_type == 3) then
        cmd = cmd .. ' -thumbnail "'  .. img_size .. '!" -extent ' .. img_size
    elseif (img_crop_type == 4) then
        cmd = cmd .. ' -thumbnail "'  .. img_size .. '^" -extent ' .. img_size
    elseif (img_crop_type == 5 or img_crop_type == 6) then
        cmd = cmd .. ' -scale "'  .. img_size .. '>"'
    else
        lua_log('img_crop_type error:'..img_crop_type,ngx.ERR)
        ngx.exit(404)
    end 
    cmd = cmd .. ' ' .. img_thumbnail_path
    return cmd
end



-- 拼接gm命令
local function generate_gm_command2(img_original_path,img_thumbnail_path)
    local cmd = c.gm_path .. ' composite  -gravity southeast -dissolve 50 /data/images/images/goods/logo.png ' .. img_thumbnail_path .. ' ' .. img_thumbnail_path
    lua_log(cmd..' water  images !' .. img_thumbnail_path,ngx.ERR)
     
    return cmd
end



lua_log("ngx_thumbnail_root======="..ngx_thumbnail_root)
lua_log("ngx_uri======="..uri)

scale_type = string.match(uri,'_[tiny|small|medium|large|original]+')
lua_log("scale_type======="..scale_type)
if (scale_type == '_tiny') then
    img_width = 150
    img_height = 150
elseif (scale_type == '_small') then
    img_width = 300
    img_height = 300
elseif (scale_type == '_medium') then
    img_width = 600
    img_height = 600
elseif (scale_type == '_large') then
    img_width = 1200
    img_height = 1200
end

if not (img_width and img_height) then
    lua_log(scale_type.. ' is not match!',ngx.ERR)
    ngx.exit(404)
else
    img_size = img_width..'x'..img_height
    lua_log(uri..' is match!')
    local img_original_uri = string.gsub(uri, cur_uri_reg, '')
    lua_log('img_original_uri_old===' .. uri)
    lua_log('cur_uri_reg===' .. cur_uri_reg)    
    lua_log('img_original_uri_new===' .. img_original_uri)
    local img_exist=io.open(ngx_img_root .. img_original_uri)
    if not img_exist then
        if not c.enabled_default_img then
            lua_log(img_original_uri..' is not exist! without default image.',ngx.ERR)
            ngx.exit(404)
        else
            img_exist=io.open(ngx_img_root ..  c.default_img_uri)
            if img_exist then
                lua_log(img_original_uri .. ' is not exist! crop image with default image')
                img_original_uri = c.default_img_uri
            else
                lua_log(img_original_uri..' is not exist! default image not exists too.',ngx.ERR)
                ngx.exit(404)
            end
        end
    end

    local img_original_path  = ngx_img_root .. img_original_uri
    local img_thumbnail_path = ngx_thumbnail_root .. uri
    local gm_command         = generate_gm_command(img_crop_type,img_original_path,img_size,img_thumbnail_path)
    local gm_command2        = generate_gm_command2(img_original_path,img_thumbnail_path)
    if (gm_command) then
        lua_log('gm_command======'..gm_command)
        _,_,img_thumbnail_dir,img__thumbnail_filename=string.find(img_thumbnail_path,'(.-)([^/]*)$')
        lua_log('dir: '..img_thumbnail_dir)
        lua_log('filename: ' ..img__thumbnail_filename)
        lua_log('mkdir -p '..img_thumbnail_dir)
        os.execute('mkdir -p '..img_thumbnail_dir)
        os.execute(gm_command)
        -- os.execute(gm_command2) -- no water images
    end
    ngx.req.set_uri('/thumbnail'..uri)
end
