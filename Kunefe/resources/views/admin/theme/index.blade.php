@extends('layouts.admin')
@section('title')
Customize Panel
@include('partials/admin.theme.nav', ['activeTab' => 'colors'])
@endsection

@section('content-header')
<h1>Theme Colors<small>Set your desired colors for in this theme</small></h1>
<ol class="breadcrumb">
    <li><a href="{{ route('admin.index') }}">Admin</a></li>
    <li class="active">Customize Panel</li>
</ol>
@endsection

@section('content')
@yield('settings::nav')
<div class="row">
    <div class="col-xs-12">
        <div class="box">
            <div class="box-header with-border">
                <h3 class="box-title">Theme Colors</h3>
            </div>
            <form action="{{ route('admin.theme') }}" method="POST">
                <div class="box-body">
                    <div class="row">
                        <div class="form-group col-md-4">
                            <label class="control-label">Background color</label>
                            <div>
                                <input type="text" class="form-control" id="background" name="customize:background" value="{{ old('customize:background', config('customize.background')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Secondary color</label>
                            <div>
                                <input type="text" class="form-control" id="secondary" name="customize:secondary" value="{{ old('customize:secondary', config('customize.secondary')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Border color</label>
                            <div>
                                <input type="text" class="form-control" id="border" name="customize:border" value="{{ old('customize:border', config('customize.border')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Other color</label>
                            <div>
                                <input type="text" class="form-control" id="other" name="customize:other" value="{{ old('customize:other', config('customize.other')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Dropdown color</label>
                            <div>
                                <input type="text" class="form-control" id="dropdown" name="customize:dropdown" value="{{ old('customize:dropdown', config('customize.dropdown')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Warning color</label>
                            <div>
                                <input type="text" class="form-control" id="warning" name="customize:warning" value="{{ old('customize:warning', config('customize.warning')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Dark button color</label>
                            <div>
                                <input type="text" class="form-control" id="darkButton" name="customize:darkButton" value="{{ old('customize:darkButton', config('customize.darkButton')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Red button color</label>
                            <div>
                                <input type="text" class="form-control" id="red" name="customize:red" value="{{ old('customize:red', config('customize.red')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Green button color</label>
                            <div>
                                <input type="text" class="form-control" id="green" name="customize:green" value="{{ old('customize:green', config('customize.green')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Purple button color</label>
                            <div>
                                <input type="text" class="form-control" id="purple" name="customize:purple" value="{{ old('customize:purple', config('customize.purple')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Code color</label>
                            <div>
                                <input type="text" class="form-control" id="code" name="customize:code" value="{{ old('customize:code', config('customize.code')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Default text color</label>
                            <div>
                                <input type="text" class="form-control" id="textColor" name="customize:textColor" value="{{ old('customize:textColor', config('customize.textColor')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Text light color</label>
                            <div>
                                <input type="text" class="form-control" id="textLight" name="customize:textLight" value="{{ old('customize:textLight', config('customize.textLight')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Text muted color</label>
                            <div>
                                <input type="text" class="form-control" id="textMuted" name="customize:textMuted" value="{{ old('customize:textMuted', config('customize.textMuted')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Main icon background</label>
                            <div>
                                <input type="text" class="form-control" id="mainIconBackground" name="customize:mainIconBackground" value="{{ old('customize:mainIconBackground', config('customize.mainIconBackground')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Main icon color</label>
                            <div>
                                <input type="text" class="form-control" id="mainIconColor" name="customize:mainIconColor" value="{{ old('customize:mainIconColor', config('customize.mainIconColor')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Info icon background</label>
                            <div>
                                <input type="text" class="form-control" id="infoIconBackground" name="customize:infoIconBackground" value="{{ old('customize:infoIconBackground', config('customize.infoIconBackground')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Info icon color</label>
                            <div>
                                <input type="text" class="form-control" id="infoIconColor" name="customize:infoIconColor" value="{{ old('customize:infoIconColor', config('customize.infoIconColor')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Info color</label>
                            <div>
                                <input type="text" class="form-control" id="info" name="customize:info" value="{{ old('customize:info', config('customize.info')) }}" />
                            </div>
                        </div>
                        <div class="form-group col-md-4">
                            <label class="control-label">Danger color</label>
                            <div>
                                <input type="text" class="form-control" id="danger" name="customize:danger" value="{{ old('customize:danger', config('customize.danger')) }}" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box-footer">
                    {!! csrf_field() !!}
                    <div> <input type="button" class="btn pull-left btn-danger" value="Default colors" style="margin-right:5px;" onclick="background.value = '#0F1032', secondary.value = '#1B1C3E', border.value = '#37d5f2', other.value = '#24284C' ,dropdown.value = '#111229', warning.value = '#fb6340', darkButton.value = '#172b4d',red.value = '#f5365c',green.value = '#2dce89',purple.value = '#5e72e4',code.value = '#f3a4b5',textColor.value = '#fff',textLight.value = '#ced4da', textMuted.value = '#8898aa', mainIconBackground.value = 'rgba(20, 104, 113, 0.702)', mainIconColor.value = 'rgb(56, 236, 236)', infoIconBackground.value = 'rgba(94, 114, 228, 0.102)', infoIconColor.value = '#8898aa', info.value = '#176775', danger.value = '#f75676'" /> </div>
                    <button type="submit" name="_method" class="btn btn-sm btn-primary pull-right">Save</button>
                </div>
        </div>
    </div>
    </form>
</div>
@endsection