local c  = require 'config'

local ngx_img_root = ngx.var.image_root
local ngx_thumbnail_root = ngx.var.thumbnail_root
local uri = ngx.var.org_file

function lua_log(msg,log_level)
	log_level = log_level or c.lua_log_level
    if(c.enabled_log) then 
		ngx.log(log_level,msg) 
	end
end

local function generate_gm_command2(img_original_path,img_thumbnail_path)
	local cmd = c.gm_path .. ' composite  -gravity southeast -dissolve 50 /data/images/images/goods/logo.png ' .. img_original_path .. ' ' .. img_thumbnail_path
	lua_log(cmd..' water  images !' .. img_thumbnail_path,ngx.ERR)
	return cmd
end


lua_log(uri..' is match!')


local img_original_uri =  uri 
lua_log('img_original_uri_old===' .. img_original_uri)

lua_log('img_original_uri_new===' .. img_original_uri)
local img_exist=io.open(ngx_img_root .. img_original_uri)
if not img_exist then
	if not c.enabled_default_img then
		lua_log(img_original_uri..' is not exist aaa!',ngx.ERR)
		ngx.exit(404)
	else
		img_exist=io.open(ngx_img_root ..  c.default_img_uri)
		if img_exist then
			lua_log(img_original_uri .. ' is not exist! crop image with default image')
			img_original_uri = c.default_img_uri
		else
			lua_log(img_original_uri..' is not exist bbb!',ngx.ERR)
			ngx.exit(404)
		end
	end
end

local img_original_path  = ngx_img_root .. img_original_uri
local img_thumbnail_path = ngx_thumbnail_root .. uri
local gm_command2        = generate_gm_command2(img_original_path,img_thumbnail_path)

	lua_log('gm_command2======'..gm_command2)
	_,_,img_thumbnail_dir,img__thumbnail_filename=string.find(img_thumbnail_path,'(.-)([^/]*)$')
	os.execute('mkdir -p '..img_thumbnail_dir)
	os.execute(gm_command2)
ngx.req.set_uri('/thumbnail'..uri)
