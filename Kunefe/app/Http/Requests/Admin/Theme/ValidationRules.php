<?php

namespace Pterodactyl\Http\Requests\Admin\Theme;

use Pterodactyl\Http\Requests\Admin\AdminFormRequest;

class ValidationRules extends AdminFormRequest
{

    public function rules()
    {
        return [
            'customize:background' => 'nullable|string|max:191',
            'customize:secondary' => 'nullable|string|max:191',
            'customize:border' => 'nullable|string|max:191',
            'customize:other' => 'nullable|string|max:191',
            'customize:dropdown' => 'nullable|string|max:191',
            'customize:warning' => 'nullable|string|max:191',
            'customize:darkButton' => 'nullable|string|max:191',
            'customize:red' => 'nullable|string|max:191',
            'customize:green' => 'nullable|string|max:191',
            'customize:purple' => 'nullable|string|max:191',
            'customize:code' => 'nullable|string|max:191',
            'customize:textColor' => 'nullable|string|max:191',
            'customize:textLight' => 'nullable|string|max:191',
            'customize:textMuted' => 'nullable|string|max:191',
            'customize:mainIconBackground' => 'nullable|string|max:191',
            'customize:mainIconColor' => 'nullable|string|max:191',
            'customize:infoIconBackground' => 'nullable|string|max:191',
            'customize:infoIconColor' => 'nullable|string|max:191',
            'customize:info' => 'nullable|string|max:191',
            'customize:danger' => 'nullable|string|max:191',
        ];
    }

    public function attributes()
    {
        return [
            'customize:background' => 'Background color',
            'customize:secondary' => 'Secondary color',
            'customize:border' => 'Border color',
            'customize:other' => 'Other color',
            'customize:dropdown' => 'Dropdown color',
            'customize:warning' => 'Warning color',
            'customize:darkButton' => 'Dark button color',
            'customize:red' => 'Red color',
            'customize:green' => 'Green color',
            'customize:purple' => 'Purple color',
            'customize:code' => 'Code color',
            'customize:textColor' => 'Default text color',
            'customize:textLight' => 'Text light color',
            'customize:textMuted' => 'Text muted color',
            'customize:mainIconBackground' => 'Main icon background',
            'customize:mainIconColor' => 'Main icon color',
            'customize:infoIconBackground' => 'Info icon background',
            'customize:infoIconColor' => 'Info icon color',
            'customize:info' => 'Info color',
            'customize:danger' => 'Danger color',
        ];
    }
}
