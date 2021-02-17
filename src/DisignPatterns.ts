//Strategy Example

namespace StrategyExample {

//used to make algorithms interchangeable and let the algorithm vary independently
class Context {

    private strategy: Strategy;

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    public doSomeBusinessLogic(): void {

        console.log('Context: Sorting data using the strategy (not sure how it\'ll do it)');
        const result = this.strategy.doAlgorithm(['a', 'b', 'c', 'd', 'e']);
        console.log(result.join(','));

    }
}

interface Strategy {
    doAlgorithm(data: string[]): string[];
}

class ConcreteStrategyA implements Strategy { //sorts the string before returning it
    public doAlgorithm(data: string[]): string[] {
        return data.sort();
    }
}

class ConcreteStrategyB implements Strategy { //reverses the string before returning it
    public doAlgorithm(data: string[]): string[] {
        return data.reverse();
    }
}

const context = new Context(new ConcreteStrategyA());
console.log('Client: Strategy is set to normal sorting.');
context.doSomeBusinessLogic();

console.log('');

console.log('Client: Strategy is set to reverse sorting.');
context.setStrategy(new ConcreteStrategyB());
context.doSomeBusinessLogic();

}

//Factory Example

namespace FactoryExample {

    class Page { //Creates the content of a page
        private _type: string;
        constructor(type: string) {
            this._type = type;
        }

        public get Type(): string {
            return this._type;
        }
    }

    //Creates all the page types (only in name)
    class SkillsPage extends Page {
        constructor() {
            super("SkillsPage");
        }
    }

    class EducationPage extends Page {
        constructor() {
            super("EducationPage");
        }
    }

    class ExperiencePage extends Page {
        constructor() {
            super("ExperiencePage");
        }
    }

    class IntroductionPage extends Page {
        constructor() {
            super("IntroductionPage");
        }
    }

    class ResultsPage extends Page {
        constructor() {
            super("ResultsPage");
        }
    }

    class ConclusionPage extends Page {
        constructor() {
            super("ConclusionPage");
        }
    }

    class SummaryPage extends Page {
        constructor() {
            super("SummaryPage");
        }
    }

    class BibliographyPage extends Page {
        constructor() {
            super("BibliographyPage");
        }
    }

    class PageFactory { //Adds the pages to a string
        private _pages = new Array();
        private _type: string;

        constructor(type: string) {
            this._type = type;
            this.createPages();
        }

        public get type(): string {
            return this._type;
        }
        public get pages() {
            return this._pages;
        }

        public createPages(): void {
            throw new Error("Method not implemented");
        }
    }

    class Resume extends PageFactory { //adds all the in this case pages to the Resume
        constructor() {
            super("Resume");
        }

        public createPages(): void {
            this.pages.push(new SkillsPage());
            this.pages.push(new EducationPage());
            this.pages.push(new ExperiencePage());
        }
    }

    class Report extends PageFactory {//adds all the pages to the Report
        constructor() {
            super("Report");
        }

        public createPages(): void {
            this.pages.push(new IntroductionPage());
            this.pages.push(new ResultsPage());
            this.pages.push(new ConclusionPage());
            this.pages.push(new SummaryPage());
            this.pages.push(new BibliographyPage());
        }
    }


    let factories = new Array(new Resume(), new Report());

    factories.forEach((factory: PageFactory) => {
        console.log("The " + factory.type + " contains the following pages:");
        factory.pages.forEach((page: Page) => {
        console.log("--" + page.Type);
        });
    });

}

//Builder Example

namespace BuilderExample {

    //Overarcing class that creates the final product
    class Shop {

        private _tvshowBuilder: TVShowBuilder;

        public Construct(tvshowBuilder: TVShowBuilder): void {
            this._tvshowBuilder = tvshowBuilder;

            this._tvshowBuilder.Theme();
            this._tvshowBuilder.MainActor();
            this._tvshowBuilder.Episodecount();
        }

        public ShowTvShow(): void {
            this._tvshowBuilder.tvshow.display();
        }
    }

    class TVShowBuilder {
        private _tvshow: TVShow = null;
        constructor(public tvshowType: TVShowType) {
            this._tvshow = new TVShow(tvshowType);
        }

        public get tvshow(): TVShow {
            return this._tvshow;
        }

        public Theme(): void {
            throw new Error("Not implemented.");
        }

        public MainActor(): void {
            throw new Error("Not implemented.");
        }

        public Episodecount(): void {
            throw new Error("Not implemented.");
        }
    }

    //Creates the actual (in this case) tv show with al its parts and adds them to the show
    class HorrorShowBuilder extends TVShowBuilder {
        constructor() {
            super(TVShowType.Horror);
        }

        public Theme(): void {
            this.tvshow.tvparts[TVPartType.Theme] = "Horror";
        }

        public MainActor(): void {
            this.tvshow.tvparts[TVPartType.MainActor] = "Freddy";
        }

        public Episodecount(): void {
            this.tvshow.tvparts[TVPartType.Episodes] = "9";
        }
    }

    //Creates the actual (in this case) tv show with al its parts and adds them to the show
    class RomanceShowBuilder extends TVShowBuilder {
        constructor() {
            super(TVShowType.Romance);
        }

        public Theme(): void {
            this.tvshow.tvparts[TVPartType.Theme] = "Romance";
        }

        public MainActor(): void {
            this.tvshow.tvparts[TVPartType.MainActor] = "Alice";
        }

        public Episodecount(): void {
            this.tvshow.tvparts[TVPartType.Episodes] = "4";
        }

    }

    class TVShow {
        constructor(public tvshowType: TVShowType) {
            this.tvshowType = tvshowType;
        }

        private _tvparts: {} = {};
        public get tvparts(): {} {
            return this._tvparts;
        }

        public display() {
            console.log("Vehicle Type : " + TVShowType[this.tvshowType]);
            console.log("Theme :" + this.tvparts[TVPartType.Theme]);
            console.log("MainActor :" + this.tvparts[TVPartType.MainActor]);
            console.log("Episode Count :" + this.tvparts[TVPartType.Episodes]);
        }
    }

    enum TVShowType {
        Horror,
        Romance,
    }

    enum TVPartType {
        Theme,
        MainActor,
        Episodes
    }

    let shop = new Shop();

    shop.Construct(new HorrorShowBuilder());
    shop.ShowTvShow();

    shop.Construct(new RomanceShowBuilder());
    shop.ShowTvShow();

}

//Object Pool Example

namespace ObjectPoolExample{

//Creates a pool of objects (in this case I used a simple vec2d class) that can easily be accessed

class Vec2d {
    public x : number;
    public y : number;

    public constructor(x : number, y : number) {
        this.x = x;
        this.y = y;
    }
}

class Vec2dPool {

   private activeList: Array<Vec2d>;
   private reserveList: Array<Vec2d>;

   private numberActive: number;
   private numberReserved: number;

   constructor(reserve: number = 5) {

       this.activeList = new Array<Vec2d>();
       this.reserveList = new Array<Vec2d>();

       this.numberActive = 0;
       this.numberReserved = 0;

       this.initializeReserve(reserve);
   }

   private initializeReserve(reserve: number) {

       for(let i = 0; i < reserve; i++)
       {
           const vec2d = new Vec2d(1,i);
           this.reserveList.push(vec2d);
       }
   }

   
   public getVec2d(): Vec2d {

       if(this.numberReserved == 0)
       {
           this.reserveList.push(new Vec2d(1,1));
           this.numberReserved++;
       }

       const vec2d = this.reserveList.pop();
       this.numberReserved--;

       this.activeList.push(vec2d);
       this.numberActive++;

       return vec2d;
   }

   public returnVec2d(vec2d: Vec2d) {

       const index = this.activeList.indexOf(vec2d);
       if(index >= 0)
       {
           this.activeList.splice(index, 1);
           this.numberActive--;

           this.reserveList.push(vec2d);
           this.numberReserved++;
       }
   }
}
}

//Singleton example

namespace SingleTonExample{
//There should only be one intance of a singleton class
class Singleton {
    public counter: number = 0;
    private static _instance: Singleton = null;

    constructor() {
        if (Singleton._instance) { //ensures that there is only one instance of the class
            throw new Error("Error: Instantiation failed: Use Singleton.current instead of new.");
        }

        Singleton._instance = this;
    }

    public static get current(): Singleton { //returns the only instance of the singleton class
        if (Singleton._instance === null) {
            Singleton._instance = new Singleton();
        }

        return Singleton._instance;
    }

    public display() { //returns the amount of singleton classes there are ofcourse that should always only be a maximum of 1
        console.log("The Singleton counter has a value of:" + this.counter);
    }
}

let singleton1 = Singleton.current;
singleton1.display();

let singleton2 = Singleton.current;
singleton2.counter++;
singleton1.display();

try {
    let singleton3 = new Singleton();
} catch (error) {
    console.log(error.message);
}

singleton2.counter++;
singleton1.display();
}

//Adapter example

namespace AdapterExample{

interface IPhone{
    useLightning();
}

interface Android{
    useMicroUSB();
}

class iPhone7 implements IPhone {
    useLightning() {
        console.log('Using lightning port..');
    }
}

class GooglePixel implements Android {
    useMicroUSB() {
        console.log('Using micro USB...');
    }
}

class LightningToMicroUSBAdapter implements Android {
    iphoneDevice: IPhone;

    constructor(iphone: IPhone) {
        this.iphoneDevice = iphone;
    }

    useMicroUSB() { //Adapts the function so that in this case an Iphone can use a microUSB charger Ofcourse in code this can used to adapt a function to work with another without having to rewrite the functionality
        console.log('Want to use micro USB, converting...');
        this.iphoneDevice.useLightning();
    }
}

let iphone = new iPhone7();
let chargeAdaptor = new LightningToMicroUSBAdapter(iphone);

chargeAdaptor.useMicroUSB();
}

//Facade example

namespace FacadeExample{

    class BlurayPlayer{
        on() {
            console.log('Bluray player turning on...');
        }
    
        turnOff() {
            console.log('Bluray turning off..');
        }
    
        play() {
            console.log('Playing bluray disc...');
        }
    }
    
    class Amplifier{
        on() {
            console.log('Amp is turning on..');
        }
    
        turnOff() {
            console.log('Amplifier turning off..');
        }
    
        setSource(source: string) {
            console.log('Setting source to ' + source);
        }
    
        setVolume(volumeLevel: number) {
            console.log('Setting volume to ' + volumeLevel);
        }
    }
    
    class Lights{
        dim() {
            console.log('Lights are dimming..');
        }
    }
    
    class TV{
        turnOn() {
            console.log('TV turning on..');
        }
    
        turnOff() {
            console.log('TV turning off..');
        }
    }
    
    
    class HomeTheaterFacade{
        private bluray: BlurayPlayer;
        private amp: Amplifier;
        private lights : Lights;
        private tv : TV;
    
        constructor(amp: Amplifier, bluray: BlurayPlayer, lights: Lights, tv: TV){
            this.bluray = bluray;
            this.amp = amp;
            this.lights = lights;
            this.tv = tv;
        }
    
        public watchMovie() { //The actual facade that sets all the functions created earlier and in this case starts everything for watching a movie.
    
            this.lights.dim();
    
            this.tv.turnOn();
    
            this.amp.on();
            this.amp.setSource('bluray');
            this.amp.setVolume(11);
    
            this.bluray.on();
            this.bluray.play();
        }
    
        endMovie() { //Facade for in this case if you stop watching a movie it will activate more complex behavior to turn of all the in this case devices.
            this.amp.turnOff();
            this.tv.turnOff();
            this.bluray.turnOff();
        }
    }
    

    let bluray = new BlurayPlayer();
    let amp = new Amplifier();
    let lights = new Lights();
    let tv = new TV();
    
    let hometheater = new HomeTheaterFacade(amp, bluray, lights, tv);
    hometheater.watchMovie();
    }

//Observer example

namespace ObserverExample {

    interface Subject{
        registerObserver(o: Observer);
        removeObserver(o: Observer);
        notifyObservers();
    }
    
    interface Observer{
        update(temperature: number);
    }
    
    class WeatherStation implements Subject{
        private temperature: number;
        private observers: Observer[] = [];
    
        setTemperature(temp: number){ //Changes the temperature and notifies all observers of the change.
            console.log('WeatherStation: new temperature measurement: ' + temp);
            this.temperature = temp;
            this.notifyObservers();
        }
    
        registerObserver(o: Observer) { //Registers a new observer that will be updated with the rest.
            this.observers.push(o);
        }
        removeObserver(o: Observer) { //Resigns a objerver from the update list and removes it.
            let index = this.observers.indexOf(o);
            this.observers.splice(index, 1);
        }
        notifyObservers() { //Infroms all the observers of the changes.
            for(let observer of this.observers){
                observer.update(this.temperature);
            }
        }
    }
    
    class TemperatureDisplay implements Observer{
        private subject: Subject;
        
        constructor(weatherStation: Subject){
            this.subject = weatherStation;
            weatherStation.registerObserver(this);
        }
    
        update(temperature: number) {
            console.log('TemperatureDisplay: ');
        }
    }
    
    class Fan implements Observer{
        private subject: Subject;
        
        constructor(weatherStation: Subject){
            this.subject = weatherStation;
            weatherStation.registerObserver(this);
        }
    
        update(temperature: number) {
            if(temperature > 25){
                console.log('Fan: its hot here, turning myself on...')
            } else {
                console.log('Fan: its nice and cool, turning myself off...')
            }
        }
    
    }
    
    let weatherStation = new WeatherStation();
    
    let tempDisplay = new TemperatureDisplay(weatherStation);
    let fan = new Fan(weatherStation);
    
    weatherStation.setTemperature(20);
    weatherStation.setTemperature(30);
    
    }
    
//State example

namespace StateExample{

interface State {
    order: Order;

    cancelOrder();
    verifyPayment();
    shipOrder();
}

//creates an order where the state can be tracked of
class Order {
    public cancelledOrderState: State;
    public paymentPendingState: State;
    public orderShipedState: State;
    public orderBeingPrepared: State;

    public currentState: State;

    constructor() {
        this.cancelledOrderState = new CancelledOrderState(this);
        this.paymentPendingState = new PaymentPendingState(this);
        this.orderShipedState = new OrderShippedState(this);
        this.orderBeingPrepared = new OrderBeingPrepared(this);

        this.setState(this.paymentPendingState);
    }

    public setState(state: State) {
        this.currentState = state;
    }

    public getCurrentState(): State{
        return this.currentState;
    }
}

//returns that the order is already cancelled and wont change the current state anymore.
class CancelledOrderState implements State {
    order: Order;

    constructor(order: Order) {
        this.order = order;
    }

    public cancelOrder() {
        console.log('This order is already cancelled.');
        this.order.setState(this.order.cancelledOrderState);
    }

    public verifyPayment() {
        console.log('The order is cancelled, you cannot pay anymore.');
    }

    public shipOrder() {
        console.log('The order is cancelled, you cannot ship it anymore.');
    }
}

//If this state is active it will cancel the order on cancelOrder and set the state to cancelled, it will verifypayment and set the state to orderbeing prepared or it will return that it needs payment to continue.
class PaymentPendingState implements State {
    order: Order;

    constructor(order: Order) {
        this.order = order;
    }

    cancelOrder() {
        console.log('Cancelling your unpaid order...');
        this.order.setState(this.order.cancelledOrderState);
    }

    verifyPayment() {
        console.log('Payment verified! Shipping soon.');
        this.order.setState(this.order.orderBeingPrepared);
    }
    shipOrder() {
        console.log('Cannot ship order when payment is pending.');
    }
}

//if the state of the order is order being prepared it will cancel the order on cancelorder, only return the that its variefied on varifypayment and ship the order on shiporder.
class OrderBeingPrepared implements State {
    order: Order;

    constructor(order: Order) {
        this.order = order;
    }

    cancelOrder() {
        console.log('Cancelling your order... You will be refunded.');
        this.order.setState(this.order.cancelledOrderState);
    }
    verifyPayment() {
        console.log('Payment is already verified.');
    }
    shipOrder() {
        console.log('Shipping your order now...');
        this.order.setState(this.order.orderShipedState);
    }
}

//The state of the order will no longer be affected and it will jsut return that everything has been sorted out
class OrderShippedState implements State {
    order: Order;

    constructor(order: Order) {
        this.order = order;
    }

    cancelOrder() {
        console.log('You cannot cancel an order that has been shipped.');
    }
    verifyPayment() {
        console.log('Payment is already verified.');
    }
    shipOrder() {
        console.log('Order is already shipped.');
    }
}

let order = new Order(); //creates a new order

order.getCurrentState().verifyPayment(); //gets the current order and checks its state on the payment
order.getCurrentState().shipOrder(); //Checks the current order again only now on the state of shipping
order.getCurrentState().cancelOrder(); //checks the current order again only now it cancels it too

}
