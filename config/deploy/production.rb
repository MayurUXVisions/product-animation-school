set :production

server "138.68.167.121", user: "forge", roles: %w{web app db}

set :deploy_to, '/home/forge/boilerplate.2022.productstaging.co.uk'

# Uncomment to link robots.txt to shared folder
#set :linked_files, fetch(:linked_files, []).push('web/robots.txt')

namespace :deploy do
  desc 'setup yarn and build assets'
      after :finishing, :build_assets do 
      on roles(:app) do     
          execute "yarn --cwd /home/forge/boilerplate.2022.productstaging.co.uk/current/web/app/themes/product-base"
          execute "yarn --cwd /home/forge/boilerplate.2022.productstaging.co.uk/current/web/app/themes/product-base prod"
      end 
  end 
end

namespace :deploy do
  desc 'Restart PHP-FPM'
      after :finishing, :restart_fpm do 
      on roles(:app) do     
          # execute "sudo /usr/sbin/service php7.2-fpm restart"
          execute "sudo /usr/sbin/service php8.0-fpm restart"
      end 
  end 
end 

fetch(:default_env).merge!(wp_env: :production)
