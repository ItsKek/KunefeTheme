@section('settings::nav')
    @yield('settings::notice')
    <div class="row">
        <div class="col-xs-12">
            <div class="nav-tabs-custom nav-tabs-floating">
                <ul class="nav nav-tabs">
                    <li @if($activeTab === 'colors')class="active"@endif><a href="{{ route('admin.theme') }}">Colors</a></li>
                </ul>
            </div>
        </div>
    </div>
@endsection
