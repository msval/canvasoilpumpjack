window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var canvas = document.getElementById('mainCanvas'),
	ctx = canvas.getContext('2d'),
	groundHeight = 290,
	groundPartWidth = 5,
	engineBodyHeight = 70,
	engineBodyWidth = 30,
	engineX = 100,
	engineY = groundHeight - Math.floor(engineBodyHeight * 9 / 10),
	engineCrankL = 40,
	engineCrankWidth = 5,
	beamWidth = 15,
	engineCrankWeightRadius = 15,
	samsonPostWidth = 30,
	samsonPostX = 250,
	samsonPostY = groundHeight - 150,
	rodLength = 80,
	beamHalfLength = 155,
	headWidth = 20,
	headNoseHeight = 70,
	polishedRodSize = 20,
	polishedRodOffset = 100,
	angle = 0,
	dAngle = 0.025, // rotational speed

	oilpump = {
		draw : function () {
			ctx.save();
			// ground
			ctx.strokeStyle = '#9EA18C';
			ctx.fillStyle = '#9EA18C';
			ctx.strokeStyle = '#9EA18C';
			ctx.fillStyle = '#9EA18C';
			var i = 0;
			ctx.beginPath();
			ctx.moveTo(0, canvas.height);
			while (i < canvas.width) {
				ctx.lineTo(i + groundPartWidth, groundHeight);
				ctx.moveTo(i += groundPartWidth, canvas.height);
			}
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, groundHeight);
			ctx.lineTo(canvas.width, groundHeight);
			ctx.stroke();
			// engine body
			ctx.strokeStyle = '#331723';
			ctx.fillStyle = '#331723';
			ctx.fillRect(engineX - engineBodyWidth / 2, groundHeight - engineBodyHeight, engineBodyWidth, engineBodyHeight);
			// engine crank
			ctx.strokeStyle = '#C2C797';
			ctx.fillStyle = '#C2C797';
			angle += dAngle;
			ctx.lineWidth = engineCrankWidth;
			ctx.beginPath();
			ctx.arc(engineX, engineY, ctx.lineWidth, 0, 2 * Math.PI); // crank joint
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(engineX, engineY);
			ctx.lineTo(engineX + Math.cos(angle) * (engineCrankL + ctx.lineWidth),
				engineY + Math.sin(angle) * (engineCrankL+ ctx.lineWidth));
			ctx.stroke();
			// crank weight
			ctx.save();
			ctx.translate(engineX + Math.cos(angle) * engineCrankL, engineY + Math.sin(angle) * engineCrankL);
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.arc(0, 0, engineCrankWeightRadius, -Math.PI / 2, Math.PI / 2);
			ctx.fill();
			ctx.restore();
			// pitman arm
			ctx.strokeStyle = '#7E9465';
			ctx.fillStyle = '#7E9465';
			var crankJoinX = engineX + Math.cos(angle) * engineCrankL * 0.7;
			var crankJoinY = engineY + Math.sin(angle) * engineCrankL * 0.7;
			ctx.beginPath();
			ctx.moveTo(crankJoinX, crankJoinY);
			var pitmanY = crankJoinY - Math.sqrt(Math.pow(rodLength, 2) - Math.pow(crankJoinX - engineX, 2));
			ctx.lineTo(engineX, pitmanY);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(crankJoinX, crankJoinY, ctx.lineWidth, 0, 2 * Math.PI); // arm joint
			ctx.fill();
			// samson post
			ctx.strokeStyle = '#586C7A';
			ctx.fillStyle = '#586C7A';
			ctx.beginPath();
			ctx.moveTo(samsonPostX, samsonPostY);
			ctx.lineTo(samsonPostX - samsonPostWidth / 2, groundHeight);
			ctx.lineTo(samsonPostX + samsonPostWidth / 2, groundHeight);
			ctx.lineTo(samsonPostX, samsonPostY);
			ctx.fill();
			// walking beam
			ctx.strokeStyle = '#997FA1';
			ctx.fillStyle = '#997FA1';
			ctx.lineWidth = beamWidth;
			ctx.beginPath();
			ctx.moveTo(samsonPostX, samsonPostY);
			var beamDX = Math.sqrt(Math.pow(beamHalfLength, 2) - Math.pow(samsonPostY - pitmanY, 2));
			ctx.lineTo(samsonPostX - beamDX, pitmanY);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(samsonPostX, samsonPostY);
			var headX = samsonPostX + beamDX;
			var headY = 2 * samsonPostY - pitmanY;
			ctx.lineTo(headX, headY);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(samsonPostX - beamDX, pitmanY, ctx.lineWidth / 2, 0, 2 * Math.PI); // ending joint
			ctx.fill();
			// bridle
			ctx.lineWidth = engineCrankWidth;
			ctx.strokeStyle = '#665E61';
			ctx.fillStyle = '#665E61';
			ctx.beginPath();
			ctx.moveTo(samsonPostX + beamHalfLength + headWidth - ctx.lineWidth, headY);
			ctx.lineTo(samsonPostX + beamHalfLength + headWidth - ctx.lineWidth, groundHeight);
			ctx.stroke();
			// polished rod
			ctx.fillRect(samsonPostX + beamHalfLength + headWidth - ctx.lineWidth - polishedRodSize / 2,
				headY + polishedRodOffset, polishedRodSize, polishedRodSize);
			// head
			ctx.strokeStyle = '#8A4560';
			ctx.fillStyle = '#8A4560';
			ctx.save();
			ctx.translate(headX, headY);
			ctx.rotate(Math.asin((samsonPostY - pitmanY) / beamDX));
			ctx.beginPath();
			ctx.fillRect(0, ctx.lineWidth / 2 - 2 * headWidth, headWidth, 2 * headWidth);
			ctx.stroke();
			ctx.restore();
			ctx.beginPath();
			ctx.arc(samsonPostX, samsonPostY, beamHalfLength + headWidth,
				Math.asin((samsonPostY - pitmanY) / beamHalfLength),
				Math.asin((samsonPostY - pitmanY + headNoseHeight) / beamHalfLength));
			ctx.lineTo(headX, headY);
			ctx.fill();
			// restore
			ctx.restore();

		}
	};

(function animloop(){
	requestAnimFrame(animloop);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	oilpump.draw();
})();