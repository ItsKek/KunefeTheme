@extends('layouts.admin')
@section('title')
@include('partials/admin.theme.nav', ['activeTab' => 'newpage'])
Customize Panel
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
                            <label class="control-label">Just copy</label>
                            <div>
                                <input type="text" class="form-control" id="background" name="customize:background" value="{{ old('customize:background', config('customize.background')) }}" />
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