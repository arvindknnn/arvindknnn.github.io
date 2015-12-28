var modal = '<!-- Modal --> <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">   <div class="modal-dialog" role="document">     <div class="modal-content">       <div class="modal-header">         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>        <h4 class="modal-title" id="myModalLabel">Modal title</h4>      </div>      <div class="modal-body">      </div>      <div class="modal-footer">        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>        <button type="button" class="btn btn-primary">Save changes</button>      </div>    </div>  </div></div>';


var modalTab ='<div>' +
'<!-- Nav tabs -->' +
'<ul class="nav nav-tabs" role="tablist">' +
'<li role="presentation"><a href="#yelp" aria-controls="Yelp" role="tab" data-toggle="tab">Yelp</a></li>' +
'<li role="presentation" class="active"><a href="#wiki" aria-controls="wiki" role="tab" data-toggle="tab">Wikipedia</a></li>' +
'</ul>' +
'<!-- Tab panes -->' +
'<div class="tab-content">' +
'<div role="tabpanel" class="tab-pane" id="yelp"></div>' +
'<div role="tabpanel" class="tab-pane active" id="wiki" data-bind="text:modalContent.wiki"></div>' +
'</div> </div>';

function addModal() {
	$("body").append(modal);
	$(".modal-body").append(modalTab);
};