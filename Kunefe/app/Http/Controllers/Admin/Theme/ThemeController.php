<?php

namespace Pterodactyl\Http\Controllers\Admin\Theme;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Pterodactyl\Http\Controllers\Controller;
use Pterodactyl\Contracts\Repository\SettingsRepositoryInterface;
use Illuminate\Contracts\Console\Kernel;
use Prologue\Alerts\AlertsMessageBag;
use Pterodactyl\Http\Requests\Admin\Theme\ValidationRules;

class ThemeController extends Controller
{
    private $settings;

    private $kernel;

    private $alert;

    public function __construct(
        AlertsMessageBag $alert,
        Kernel $kernel,
        SettingsRepositoryInterface $settings
    ) {
        $this->alert = $alert;
        $this->kernel = $kernel;
        $this->settings = $settings;
    }

    public function index(): View
    {
        return view('admin.theme.index');
    }

    public function newpage(): View
    {
        return view('admin.theme.newpage');
    }

    /**
     * @throws \Pterodactyl\Exceptions\Model\DataValidationException
     * @throws \Pterodactyl\Exceptions\Repository\RecordNotFoundException
     */
    public function update(ValidationRules $request): RedirectResponse
    {
        foreach ($request->normalize() as $key => $value) {
            $this->settings->set('settings::' . $key, $value);
        }

        $this->kernel->call('queue:restart');
        $this->alert->success('The colors are changed, please go to the homepage to review them.')->flash();

        return redirect()->route('admin.theme');
    }
}
