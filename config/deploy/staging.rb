set :stage, :staging

server "209.250.227.35", user: "forge", roles: %w{web app db}

set :deploy_to, '/home/forge/unitedworldschools.2023.productstaging.co.uk'

fetch(:default_env).merge!(wp_env: :staging)

# Make sure robots is checked on staging
set :linked_files, fetch(:linked_files, []).push('web/robots.txt')

namespace :deploy do
    desc 'Add Staging Robots.txt'
        before :check, :robots do
        on roles(:app) do
            execute "echo $\"User-agent: *\" > #{shared_path}/web/robots.txt"
            execute "echo $\"Disallow: /\" >> #{shared_path}/web/robots.txt"
        end
    end 
end

# namespace :deploy do
# desc 'setup yarn and build assets'
#     after :finishing, :build_assets do 
#     on roles(:app) do     
#         execute "yarn --cwd /home/forge/__SITE__URL__/current/web/app/themes/__THEME_DIR__"
#         execute "yarn --cwd /home/forge/__SITE__URL__/current/web/app/themes/__THEME_DIR__ prod"
#     end 
# end 
# end

namespace :deploy do
    desc 'Restart PHP-FPM'
        after :finishing, :restart_fpm do 
        on roles(:app) do     
            # execute "sudo /usr/sbin/service php7.2-fpm restart"
            execute "sudo /usr/sbin/service php8.0-fpm restart"
        end 
    end 
end 
