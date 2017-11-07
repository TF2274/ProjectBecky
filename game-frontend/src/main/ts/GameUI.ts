///<reference path="./Renderable.ts"/>
///<reference path="./ClientPlayer.ts"/>
///<reference path="./collections/Set.ts"/>
///<reference path="./Player.ts"/>

/**
 * Created by davidmcfall on 10/3/17.
 */


class GameUI implements Renderable {

    private healthLabelFont: string = "Arial";
    private healthLabelColor: string = "white";
    private healthLabelSize: string = "22px"

    private healthBoarderColor: string = "white";
    private healthBorderThickness: number = 10;
    private healthInnerColor: string = "green";

    private scoreFont: string = "Arial";
    private scoreFontSize: string = "22px";
    private scoreFontColor: string = "white";

    private leaderBoardFont: string = "Arial";
    private leaderBoardFontSize: string = "16px";
    private leaderBoardFontColor: string = "white";

    private leaderBoardBoarderColor: string = "white";
    private leaderBoardBoarderThickness: number = 10;

    private viewWidth: number;
    private viewHeight: number;
    private player: ClientPlayer;
    private leaderBoardList: Set<Player>;

    private usernameMetrics: TextMetrics = null;
    private usernameDrawX: number;
    private usernameDrawY: number;

    constructor(viewWidth: number, viewHeight: number) {
        this.player = null;
        this.leaderBoardList = null;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
    }

    /**
     * Links a player to the UI. This is for the drawing of their health bar and score.
     * @param player
     */
    public linkPlayer(player: ClientPlayer): void {
        this.player = player;
    }

    /**
     * Links players to the UI. This is for the drawing of their scores on the leader board.
     * @param leaderBoardList
     */
    public linkLeaderBoardList(leaderBoardList: Set<Player>): void {
        this.leaderBoardList = leaderBoardList;
    }

    /**
     *  This is the public method called to draw the different components of the games ui.
     *
     *  @param context
     *  @param screenOrigin
     */
    public draw(context: CanvasRenderingContext2D, screenOrigin: Point): void {
        // Make sure player is not null before attempting to draw
        if (this.player !== null) {
            // Draws the health bar
            this.drawHealthBar(context);

            // Draws the score
            this.drawUsernameAndScore(context);
        }

        // Make sure list is not null before attempting to draw
        if (this.leaderBoardList !== null) {
            // Make sure the list is not empty before drawing
            if (!this.leaderBoardList.empty()) {
                // Draws the leader board
                this.drawLeaderBoard(context);
            }
        }
    }

    /**
     *  This will draw a leader board in the top right of the screen for the set list of opponents given. Draws the first
     *  5 players
     *
     *  @param context
     */
    private drawLeaderBoard(context: CanvasRenderingContext2D): void {
        // Draw background of leader board
        context.fillStyle = "rgba(0,0,0,.5)";
        context.fillRect(context.canvas.width - 300, 10, 290, 210);

        // Draw border of leader board
        context.strokeStyle = this.leaderBoardBoarderColor;
        context.lineWidth = this.leaderBoardBoarderThickness;
        context.strokeRect(context.canvas.width - 300, 10, 290, 210);

        // Draw label for leader board
        context.fillStyle = "white";
        context.fillText("Leader board", context.canvas.width - 220, 40);

        // Start drawing the top 5 players
        let x = context.canvas.width - 280;
        let y = 80;

        for (let i = 0; i < this.leaderBoardList.length; i++) {
            if (i == 4) {
                break;
            }

            if (this.leaderBoardList.get(i).getUsername().length > 10) {
                // Draw their score based on their position in the set
                context.fillText((i + 1) + " - " + this.leaderBoardList.get(i).getUsername().substr(0, 7) + "... (" + this.leaderBoardList.get(i).getScore() + " pts)", x, y);
            }
            else {
                // Draw their score based on their position in the set
                context.fillText((i + 1) + " - " + this.leaderBoardList.get(i).getUsername() + " (" + this.leaderBoardList.get(i).getScore() + " pts)", x, y);
            }
            y += 30;
        }
    }

    /**
     *  This draws the players personal health bar in the top left of the screen canvas
     *
     *  @param context
     */
    private drawHealthBar(context: CanvasRenderingContext2D): void {
        // Draw health bar background
        context.fillStyle = "black";
        context.fillRect(0, 0, 120, 30);

        // Draw health bar label
        context.font = this.healthLabelSize + " " + this.healthLabelFont;
        context.fillStyle = this.healthLabelColor;
        context.fillText("Health", 125, 30);

        // Draw border of health bar
        context.strokeStyle = this.healthBoarderColor;
        context.lineWidth = this.healthBorderThickness;
        context.strokeRect(5, 5, 110, 30);

        // Draw internals of health bar
        context.fillStyle = this.healthInnerColor;
        context.fillRect(10, 10, (this.player.getHealth()), 20);
    }

    /**
     *  This draws the players score in the top center of the screen canvas.
     *
     *  @param context
     */
    private drawUsernameAndScore(context: CanvasRenderingContext2D): void {
        //screen middle x
        let midX: number = context.canvas.width / 2;

        // Set the context properties for the text
        context.font = this.scoreFontSize + " " + this.scoreFont;
        context.fillStyle = this.scoreFontColor;

        //draw username by getting metrics
        if(this.usernameMetrics === null) {
            this.usernameMetrics = context.measureText(this.player.getUsername());
            this.usernameDrawX = midX - this.usernameMetrics.width/2;
            this.usernameDrawY = 32;
        }
        context.fillText(this.player.getUsername(), this.usernameDrawX, this.usernameDrawY);

        //draw score info
        let scoreStr: string = "Score: " + this.player.getScore();
        let scoreWidth: number = context.measureText(scoreStr).width;
        context.fillText(scoreStr, midX - scoreWidth/2, this.usernameDrawY + 32);
    }
}