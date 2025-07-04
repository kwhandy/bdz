module Editors::BindersHelper
  def binder_status(status)
    if status == 'published'
      lucide_icon('lock-open', class: 'size-4')
    else
      lucide_icon('lock', class: 'size-4')
    end
  end
end
