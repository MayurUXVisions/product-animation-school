set :application, 'www.product-animation-school.org'
set :branch, :master

set :keep_releases, 3 #number of releases

set :default_env, { path: "/usr/local/bin:$PATH" }
set :composer_install_flags, '--no-dev --no-interaction --optimize-autoloader'


set :linked_files, fetch(:linked_files, []).push('.env')
set :linked_dirs, fetch(:linked_dirs, []).push('web/app/uploads')
set :linked_dirs, fetch(:linked_dirs, []).push('web/app/plugins')

namespace :deploy do
    desc 'Update WordPress template root paths to point to the new release'
    task :update_option_paths do
      on roles(:app) do
        within fetch(:release_path) do
          if test :wp, :core, 'is-installed'
            [:stylesheet_root, :template_root].each do |option|
              # Only change the value if it's an absolute path
              # i.e. The relative path "/themes" must remain unchanged
              # Also, the option might not be set, in which case we leave it like that
              value = capture :wp, :option, :get, option, raise_on_non_zero_exit: false
              if value != '' && value != '/themes'
                execute :wp, :option, :set, option, fetch(:release_path).join('web/wp/wp-content/themes')
              end
            end
          end
        end
      end
    end
  end
