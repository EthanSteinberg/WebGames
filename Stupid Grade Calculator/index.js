$(function(){
	"use strict";


	function recalc()
	{
		var currentGrade = $("#currentGrade").val();
		var targetGrade = $("#targetGrade").val();
		var finalPercent = $("#finalPercent").val();

		var curWeighted = currentGrade * (1-finalPercent/100);
		var needed = targetGrade - curWeighted;
		var score = needed/finalPercent * 100;
 		$("#neededGrade").val(score);
		
	}

	$(".calcIn").bind('keyup',function(){
		recalc();
	});



});