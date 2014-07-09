this.imagePreview = function(){ 
    xOffset = -20;
    yOffset = 40;   
    
    $("a.markdown-img-preview").hover(function(e){
      this.t = this.title;
      this.title = "";
       var c = (this.t != "") ? "<br/>" + this.t : "";
         $("body").append("<p id='preview'><img class='markdown-preview' src='"+ this.href +"' alt='Image preview' /></p>");                 
         $("#preview")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px")
            .fadeIn("slow");
    },
  
    function(){
        this.title = this.t;
        $("#preview").remove();

    }); 
  
    $(".markdown-img-preview").mousemove(function(e){
        $("#preview")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px");
    });     
};
// starting the script on page load
$(document).ready(function(){
  imagePreview();
})

$(document).on("mouseenter mousemove", "a.markdown-img-preview", function() {
  imagePreview();
});