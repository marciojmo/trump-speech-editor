// Video states
States = {
    WaitingForNextMute: 0,
    WaitingForMuteEnd: 1,
}

function TSE_Player( video_id = "", mute_intervals = [], target_div = "tse-viewer", width = 640, height = 390, callback = null )
{
	//////////////////////////////
	// Default values 			//
	//////////////////////////////
	this.current_video_time = 0;
	this.total_video_time = 0;
	this.time_updater = null;
	this.player = null;
	this.current_mute_index = 0;
	this.state = States.WaitingForNextMute;

	
	///////////////////////
	// Methods			 //
	///////////////////////
	// Player initializer
	this.init_player = function() 
	{
		video_properties = 
		{
			width: this.width,
			height: this.height,
			videoId: this.video_id,
			playerVars:
			{
				autoplay: 1,
				controls: 1,
				disablekb: 1,
				hl: 'en-en',
				loop: 0,
				modestbranding: 1,
				showinfo: 0,
				autohide: 1,
				color: 'white',
				iv_load_policy: 3,
				theme: 'light',
				rel: 0
			},
			events:
			{
				'onReady': this.on_ready_callback.bind(this),
			}
		}
		
		// Instantiates the player
		this.player = new YT.Player( this.target_div, video_properties );
	};
	
	this.on_progress = function()
	{
		if ( this.current_mute_index < this.mute_intervals.length )
		{
			// Check the trump player state and mutes/unmutes the video.
			switch ( this.state )
			{
				case States.WaitingForNextMute:
					if ( this.current_video_time > this.mute_intervals[this.current_mute_index].begin && !this.player.isMuted() )
					{
						this.player.mute();
						this.state = States.WaitingForMuteEnd;
					}
					break;
				case States.WaitingForMuteEnd:
					if ( this.current_video_time > this.mute_intervals[this.current_mute_index].end && this.player.isMuted() )
					{
						this.player.unMute();
						this.current_mute_index++;
						this.state = States.WaitingForNextMute;
					}
					break;
			}
		}
	};
	
	// Time updater
	this.update_time = function()
	{
		var old_time = this.current_video_time;
		if ( this.player.getPlayerState() == 1 )
			this.current_video_time = this.player.getCurrentTime();

		if ( this.current_video_time !== old_time )
			this.on_progress();
	};
	
	
	
	// Callback to be called when the video is ready.
	this.on_ready_callback = function( event )
	{
		this.total_video_time = this.player.getDuration();
		this.time_updater = setInterval( this.update_time.bind(this), 200 );
		if ( this.callback )
			this.callback();
	};
	
	
	
	
	
	
	
	
	////////////////////////////////////
	// Constructor settings and calls //
	////////////////////////////////////
	this.video_id = video_id;
	this.mute_intervals = mute_intervals;
	this.width = width;
	this.height = height;
	this.target_div = target_div;
	this.callback = callback;
	
	// Initializes the player
	this.init_player();
	
}